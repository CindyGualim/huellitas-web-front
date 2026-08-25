import { ShieldAlert } from 'lucide-react';

export function RestrictedAccess() {
  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-[16px] p-10 shadow-sm border border-[#D9D9D9]/50 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-50 rounded-full">
            <ShieldAlert size={28} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-[#222222] text-xl font-medium mb-2">No tenés acceso a esta sección</h2>
        <p className="text-[#222222]/50 text-sm">
          Esta parte del panel está reservada para otros roles. Si creés que deberías tener acceso, contactá a un Superadministrador.
        </p>
      </div>
    </div>
  );
}
