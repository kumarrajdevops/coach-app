import { renderInline } from "@/lib/inline-text"

interface ContentTableProps {
  headers: string[]
  rows: string[][]
}

export function ContentTable({ headers, rows }: ContentTableProps) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-left text-[0.88rem]">
        <thead>
          <tr className="border-b bg-muted/40">
            {headers.map((h) => (
              <th key={h} className="px-3.5 py-2 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3.5 py-2 align-top text-foreground/90">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
