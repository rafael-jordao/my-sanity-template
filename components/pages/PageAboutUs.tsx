import { IAboutUs } from '@/sanity/pages/AboutUs';

export default function PageAboutUs({ data }: { data: IAboutUs }) {
  return <h1 className="text-white">{data?.settings?.seo?.description}</h1>;
}
