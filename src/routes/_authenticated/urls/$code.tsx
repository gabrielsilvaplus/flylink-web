import { createFileRoute } from '@tanstack/react-router'
import { UrlDetails } from '@/features/urls/components/UrlDetails'

export const Route = createFileRoute('/_authenticated/urls/$code')({
  component: UrlDetailsPage,
})

/**
 * Página de detalhes de uma URL encurtada.
 * Delega toda a lógica e UI para o componente UrlDetails.
 */
function UrlDetailsPage() {
  const { code } = Route.useParams()
  return <UrlDetails code={code} />
}
