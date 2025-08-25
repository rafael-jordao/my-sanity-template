import { IPageLegal } from '@/lib/sanity/types/pages/IPageLegal';

export default function PageLegal({ data }: { data: IPageLegal }) {
  return <h1 className="text-white">{data?.settings?.title}</h1>;
}
