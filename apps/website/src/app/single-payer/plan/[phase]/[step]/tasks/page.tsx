import { tasksRoute } from "@website/lib/plan/views/tasks"

const route = tasksRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
