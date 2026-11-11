import { permanentRedirect } from "next/navigation";

import { routes } from "@/config/site";

/** /resources has a single section today: the blog. */
export default function ResourcesPage() {
  permanentRedirect(routes.blog);
}
