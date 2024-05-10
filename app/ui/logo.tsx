import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function RevioLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Squares2X2Icon className="h-12 w-12 rotate-[45deg] pr-2" />
      <p className="text-[44px]">Revio</p>
    </div>
  );
}
