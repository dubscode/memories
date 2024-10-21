'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useState } from 'react'

export default function ScreenshotCapture() {
  const [screenshot, setScreenshot] = useState<string | null>(null)

  const captureScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      await new Promise(resolve => video.onloadedmetadata = resolve)
      video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)

      const screenshotDataUrl = canvas.toDataURL('image/png')
      setScreenshot(screenshotDataUrl)

      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Error capturing screenshot:', error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Screenshot Capture</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={captureScreenshot}>Capture Screenshot</Button>
        {screenshot && (
          <div className="mt-4">
            <img src={screenshot} alt="Captured screenshot" className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
