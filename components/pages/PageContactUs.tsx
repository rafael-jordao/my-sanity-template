import { IContactUs } from '@/lib/sanity/types/pages/IContactUs';

export default function PageContactUs({ data }: { data: IContactUs }) {
  return (
    <div>
      <h1>{data?.settings?.title}</h1>
      {data?.content?.title && <h2>{data.content.title}</h2>}
    </div>
  );
}
