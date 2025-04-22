// Главная страница - MainPage (Андрей Б)
import { Layout } from '@/components/layout/Layout';
import RequestList from '@/components/RequestList';

export default function Home() {
  return (
    <Layout>
      <div className="sidebar m-0.5 min-w-[340px]">
        <RequestList />
      </div>
    </Layout>
  );
}
