import { tasksRoute } from "@website/lib/plan/views/tasks"

const route = tasksRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
