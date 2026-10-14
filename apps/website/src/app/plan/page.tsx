import { planIndexRoute } from "@website/lib/plan/views/plan-index"

const route = planIndexRoute("hybrid")
export const metadata = route.metadata
export default route.Page
