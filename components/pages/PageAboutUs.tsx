import { IAboutUs } from '@/lib/sanity/types/pages/IAboutUs';

export default function PageAboutUs({ data }: { data: IAboutUs }) {
  return <h1 className="text-white">{data?.settings?.title}</h1>;
}
