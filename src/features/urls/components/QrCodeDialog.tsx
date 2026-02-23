import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useRef } from 'react'

interface QrCodeDialogProps {
    url: string
    code: string
    trigger?: React.ReactNode
}

export function QrCodeDialog({ url, code, trigger }: QrCodeDialogProps) {
    const svgRef = useRef<SVGSVGElement>(null)

    const downloadQrCode = () => {
        if (!svgRef.current) return

        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = `qrcode-${code}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="icon">
                        <QrCode className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle className="text-center">QR Code</DialogTitle>
                    <DialogDescription className="text-center">
                        Escaneie para acessar o link encurtado.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-border/50">
                        <QRCodeSVG
                            value={url}
                            size={200}
                            level="H"
                            includeMargin={false}
                            ref={svgRef}
                            className="text-black" // Ensure QR code is black context of the white box
                        />
                    </div>
                    <Button onClick={downloadQrCode} className="w-full" variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PNG
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
