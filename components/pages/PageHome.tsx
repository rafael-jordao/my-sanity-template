import { IHomepage } from '@/sanity/pages/Homepage';

export default function PageHome({ data }: { data: IHomepage }) {
  return <h1 className="text-white">{data?.settings?.seo?.description}</h1>;
}
