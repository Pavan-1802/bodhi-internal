import { getColor } from "@/utils"

export default function StatusBadge({ status }: { status: string }) {
    return (
        <div className={`text-sm px-2 py-1 rounded-full w-max ${getColor(status)}`}>{status}</div>
    )
}   