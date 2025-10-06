"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface TabsProps {
  children: {
    history: React.ReactNode;
    team: React.ReactNode;
    expertise: React.ReactNode;
  };
}

export function AboutTabs({ children }: TabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("history")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["history", "team", "expertise"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/about?tab=${value}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-5xl mx-auto">
      <TabsList className="grid grid-cols-3 gap-4 bg-transparent mb-8">
        <TabsTrigger
          value="history"
          className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 px-8"
        >
          Histoire
        </TabsTrigger>
        <TabsTrigger
          value="team"
          className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 px-8"
        >
          Équipe
        </TabsTrigger>
        <TabsTrigger
          value="expertise"
          className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 px-8"
        >
          Expertise
        </TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children.history}
        </motion.div>
      </TabsContent>

      <TabsContent value="team" className="mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children.team}
        </motion.div>
      </TabsContent>

      <TabsContent value="expertise" className="mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children.expertise}
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}