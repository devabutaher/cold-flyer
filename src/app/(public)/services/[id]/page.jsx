import ServiceDetail from "@/components/detail/service-detail";
import servicesApi from "@/lib/api/services";

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  try {
    const response = await servicesApi.getServiceBySlug(slug);
    const service = response.data?.service;
    return {
      title: service ? `${service.name} | ColdFlyer Services` : "Service | ColdFlyer",
    };
  } catch {
    return { title: "Service | ColdFlyer" };
  }
}

export default async function ServicePage({ params }) {
  const { id: slug } = await params;
  return (
    <>
      <ServiceDetail serviceSlug={slug} />
    </>
  );
}
