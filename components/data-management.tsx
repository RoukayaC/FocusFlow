"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, Database, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ExportData {
  tasks: any[]
  preferences: any
  exportDate: string
  version: string
}

export function DataManagementDialog() {
  const [open, setOpen] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  // Export all data to JSON file
  const exportData = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('daily-planner-tasks') || '[]')
      const preferences = JSON.parse(localStorage.getItem('user-preferences') || '{}')
      const formData = Object.keys(localStorage)
        .filter(key => key.startsWith('form-'))
        .reduce((acc, key) => {
          acc[key] = JSON.parse(localStorage.getItem(key) || '{}')
          return acc
        }, {} as Record<string, any>)

      const exportData: ExportData = {
        tasks,
        preferences,
        formData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Data exported successfully!",
        description: "Your data has been downloaded as a JSON file.",
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      })
    }
  }

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string) as ExportData
        
        // Validate imported data structure
        if (!importedData.tasks || !Array.isArray(importedData.tasks)) {
          throw new Error('Invalid data format: tasks not found or not an array')
        }

        // Import tasks
        if (importedData.tasks.length > 0) {
          localStorage.setItem('daily-planner-tasks', JSON.stringify(importedData.tasks))
        }

        // Import preferences
        if (importedData.preferences && typeof importedData.preferences === 'object') {
          localStorage.setItem('user-preferences', JSON.stringify(importedData.preferences))
        }

        // Import form data
        if (importedData.formData && typeof importedData.formData === 'object') {
          Object.entries(importedData.formData).forEach(([key, value]) => {
            if (key.startsWith('form-')) {
              localStorage.setItem(key, JSON.stringify(value))
            }
          })
        }

        toast({
          title: "Data imported successfully!",
          description: `Imported ${importedData.tasks.length} tasks and preferences. Please refresh the page.`,
        })

        // Refresh page to reflect changes
        setTimeout(() => {
          window.location.reload()
        }, 2000)

      } catch (error) {
        console.error('Import error:', error)
        toast({
          title: "Import failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive"
        })
      } finally {
        setIsImporting(false)
        // Reset file input
        event.target.value = ''
      }
    }

    reader.readAsText(file)
  }

  // Clear all local storage data
  const clearAllData = () => {
    try {
      // Clear specific app data
      const keysToRemove = [
        'daily-planner-tasks',
        'user-preferences',
        ...Object.keys(localStorage).filter(key => key.startsWith('form-'))
      ]

      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })

      toast({
        title: "All data cleared",
        description: "Your data has been completely removed. The page will refresh.",
      })

      // Refresh page
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error('Clear data error:', error)
      toast({
        title: "Failed to clear data",
        description: "There was an error clearing your data.",
        variant: "destructive"
      })
    }
  }

  // Get storage usage info
  const getStorageInfo = () => {
    try {
      const tasks = localStorage.getItem('daily-planner-tasks')
      const preferences = localStorage.getItem('user-preferences')
      const formKeys = Object.keys(localStorage).filter(key => key.startsWith('form-'))
      
      const tasksSize = tasks ? new Blob([tasks]).size : 0
      const preferencesSize = preferences ? new Blob([preferences]).size : 0
      const formDataSize = formKeys.reduce((total, key) => {
        const data = localStorage.getItem(key)
        return total + (data ? new Blob([data]).size : 0)
      }, 0)

      const totalSize = tasksSize + preferencesSize + formDataSize
      const taskCount = tasks ? JSON.parse(tasks).length : 0

      return {
        totalSize: (totalSize / 1024).toFixed(2), // KB
        taskCount,
        formDrafts: formKeys.length
      }
    } catch {
      return { totalSize: '0', taskCount: 0, formDrafts: 0 }
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Storage Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Storage Information</CardTitle>
                <CardDescription>
                  Current data usage in your browser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Tasks:</span>
                  <span className="font-medium">{storageInfo.taskCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Form Drafts:</span>
                  <span className="font-medium">{storageInfo.formDrafts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage Used:</span>
                  <span className="font-medium">{storageInfo.totalSize} KB</span>
                </div>
              </CardContent>
            </Card>

            {/* Export Data */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </CardTitle>
                <CardDescription>
                  Download a backup of all your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </CardContent>
            </Card>

            {/* Import Data */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Restore data from a backup file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="import-file">Select backup file</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={importData}
                    disabled={isImporting}
                  />
                </div>
                {isImporting && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                    📥 Importing data, please wait...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clear Data */}
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </CardTitle>
                <CardDescription>
                  Permanently remove all stored data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowClearDialog(true)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Clear All Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{storageInfo.taskCount} tasks</li>
                <li>All user preferences</li>
                <li>All form drafts ({storageInfo.formDrafts} items)</li>
              </ul>
              <br />
              <strong>This action cannot be undone.</strong> Make sure you have exported your data first if you want to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}