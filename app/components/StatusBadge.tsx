import { getColor } from "@/utils"

export default function StatusBadge({ status }: { status: string }) {
    return (
        <div className={`text-sm p-1 rounded-full w-max ${getColor(status)}`}>{status}</div>
    )
}   