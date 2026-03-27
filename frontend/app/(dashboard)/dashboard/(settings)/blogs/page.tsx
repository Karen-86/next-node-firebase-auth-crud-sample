import { BreadcrumbDemo } from "@/components/index";
import Template from "./Template";

const page = async () => {

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `blogs`,
    },
  ];

  return (
    <main className="blog-section-page py-5 px-5">
      <h2 className="text-2xl mb-3 capitalize">Blogs</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Template  />
    </main>
  );
};

export default page;
