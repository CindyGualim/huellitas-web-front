// Las reglas de estados (qué transición se permite) y el máximo de destacadas viven en el backend y
// se copian aquí para armar la interfaz. Este test lee el código del backend y avisa si las copias se
// desincronizan. Si el repositorio del backend no está junto a este (p. ej. en otra máquina), se omite.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PET_STATUS_TRANSITIONS, ADOPTION_REQUEST_TRANSITIONS } from './petMappings';
import { PATIENT_STATUS_TRANSITIONS } from './eventMappings';
import { MAX_FEATURED_PETS } from './api';

const BACKEND = resolve(__dirname, '../../../../huellitas-web/huellitas-web/src/backend');
const hasBackend = existsSync(BACKEND);

// Extrae `const NOMBRE = { Clave: ["a", "b"], ... };` del archivo del backend (sin ejecutarlo).
function readTransitions(file: string, constName: string): Record<string, string[]> {
  const source = readFileSync(resolve(BACKEND, file), 'utf8');
  const block = new RegExp(`const ${constName} = \\{([\\s\\S]*?)\\n\\};`).exec(source);
  if (!block) throw new Error(`No se encontró ${constName} en ${file}`);

  const result: Record<string, string[]> = {};
  for (const match of block[1].matchAll(/^\s*(\w+):\s*\[([^\]]*)\]/gm)) {
    result[match[1]] = [...match[2].matchAll(/"([^"]+)"/g)].map(value => value[1]);
  }
  return result;
}

const sorted = (table: Record<string, string[]>) =>
  Object.fromEntries(Object.entries(table).map(([key, values]) => [key, [...values].sort()]).sort(([a], [b]) => a.localeCompare(b)));

describe.skipIf(!hasBackend)('las reglas copiadas del backend siguen iguales', () => {
  it('transiciones de estado de mascotas', () => {
    expect(sorted(PET_STATUS_TRANSITIONS)).toEqual(sorted(readTransitions('services/pet.service.js', 'VALID_STATUS_TRANSITIONS')));
  });

  it('transiciones de solicitudes de adopción', () => {
    expect(sorted(ADOPTION_REQUEST_TRANSITIONS)).toEqual(sorted(readTransitions('services/adoption.service.js', 'VALID_REQUEST_TRANSITIONS')));
  });

  it('transiciones de pacientes de jornadas', () => {
    expect(sorted(PATIENT_STATUS_TRANSITIONS)).toEqual(sorted(readTransitions('services/eventRegistration.service.js', 'VALID_PATIENT_TRANSITIONS')));
  });

  it('máximo de mascotas destacadas', () => {
    const source = readFileSync(resolve(BACKEND, 'repositories/pet.repository.js'), 'utf8');
    expect(Number(/const MAX_FEATURED_PETS = (\d+);/.exec(source)?.[1])).toBe(MAX_FEATURED_PETS);
  });
});
