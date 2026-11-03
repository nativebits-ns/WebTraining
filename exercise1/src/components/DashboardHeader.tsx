import Button from './Button'

interface DashboardHeaderProps {
  productCount: number
}

const DashboardHeader = ({ productCount }: DashboardHeaderProps) => (
  <header className="mb-8 space-y-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Products
        </h1>
      </div>
    </div>
  </header>
)

export default DashboardHeader