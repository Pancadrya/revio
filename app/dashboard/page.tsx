import {
  ArrowLeftIcon,
  PhotoIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <div className="bg-color-blue flex h-full w-full items-center justify-center">
      <h1 className={`${lusitana.className} text-4xl md:text-6xl lg:text-8xl`}>
        <span className="block">Select</span>
        <span className="block text-blue-500">Your Tool</span>
      </h1>
    </div>
  );
}
