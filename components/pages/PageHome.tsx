import { IHomepage } from '@/lib/sanity/types/pages/IHomepage';

export default function PageHome({ data }: { data: IHomepage }) {
  return <h1 className="text-white">{data?.settings?.title}</h1>;
}
