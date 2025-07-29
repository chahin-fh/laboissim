"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, FileText, Users, Award, ExternalLink, Download, Eye } from "lucide-react"

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const publications = [
    {
      id: "pub-1",
      title: "Towards Transparent AI: A Framework for Explainable Machine Learning Models",
      authors: ["Martin J.", "Moreau E.", "Garcia C."],
      journal: "Journal of Artificial Intelligence Research",
      year: 2023,
      type: "Article",
      abstract:
        "This paper presents a novel framework for developing explainable machine learning models that maintain high performance while providing transparent decision-making processes. We introduce new metrics for quantifying explainability and demonstrate their effectiveness across various domains.",
      keywords: ["Explainable AI", "Transparency", "Machine Learning", "Ethics"],
      doi: "10.1234/jair.2023.123",
      url: "#",
      citations: 24,
      pdf: "#",
    },
    {
      id: "pub-2",
      title: "Genomic Biomarkers for Personalized Cancer Treatment",
      authors: ["Dubois S.", "Chen L.", "Martin J."],
      journal: "Nature Medicine",
      year: 2023,
      type: "Article",
      abstract:
        "We identify novel genomic biomarkers that predict response to targeted cancer therapies, enabling more effective personalized treatment strategies. Our findings demonstrate significant improvements in patient outcomes when treatment decisions are guided by these biomarkers.",
      keywords: ["Genomics", "Cancer", "Personalized Medicine", "Biomarkers"],
      doi: "10.1038/nm.2023.456",
      url: "#",
      citations: 37,
      pdf: "#",
    },
    {
      id: "pub-3",
      title: "High-Efficiency Perovskite-Silicon Tandem Solar Cells",
      authors: ["Leroy T.", "Chen L.", "Martin J."],
      journal: "Nature Energy",
      year: 2023,
      type: "Article",
      abstract:
        "We report the development of perovskite-silicon tandem solar cells with record efficiency of 29.8%. The novel interface engineering approach presented in this work addresses stability issues while maintaining high performance, representing a significant step towards commercial viability.",
      keywords: ["Solar Energy", "Perovskite", "Photovoltaics", "Renewable Energy"],
      doi: "10.1038/nenergy.2023.789",
      url: "#",
      citations: 42,
      pdf: "#",
    },
    {
      id: "pub-4",
      title: "Quantum Algorithms for Cryptanalysis: Beyond Shor's Algorithm",
      authors: ["Garcia C.", "Martin J.", "Moreau E."],
      journal: "Quantum Information Processing",
      year: 2023,
      type: "Article",
      abstract:
        "This paper introduces novel quantum algorithms that extend beyond Shor's algorithm for cryptanalysis. We analyze their theoretical performance against modern cryptographic systems and discuss implications for post-quantum cryptography.",
      keywords: ["Quantum Computing", "Cryptography", "Algorithms", "Security"],
      doi: "10.1007/qip.2023.101",
      url: "#",
      citations: 18,
      pdf: "#",
    },
    {
      id: "pub-5",
      title: "Neuromorphic Computing: Bridging Neuroscience and Artificial Intelligence",
      authors: ["Moreau E.", "Dubois S.", "Garcia C."],
      journal: "Neuron",
      year: 2023,
      type: "Review",
      abstract:
        "This comprehensive review examines the intersection of neuroscience and artificial intelligence, focusing on neuromorphic computing architectures. We discuss recent advances, challenges, and future directions for brain-inspired computing systems.",
      keywords: ["Neuromorphic Computing", "Neuroscience", "AI", "Brain-inspired Computing"],
      doi: "10.1016/neuron.2023.202",
      url: "#",
      citations: 53,
      pdf: "#",
    },
    {
      id: "pub-6",
      title: "Smart Nanomaterials for Targeted Drug Delivery",
      authors: ["Chen L.", "Leroy T.", "Dubois S."],
      journal: "Advanced Materials",
      year: 2022,
      type: "Article",
      abstract:
        "We present the synthesis and characterization of novel smart nanomaterials designed for targeted drug delivery. These materials respond to specific biological triggers, enabling precise spatial and temporal control of drug release with minimal side effects.",
      keywords: ["Nanomaterials", "Drug Delivery", "Biomedicine", "Smart Materials"],
      doi: "10.1002/adma.2022.303",
      url: "#",
      citations: 61,
      pdf: "#",
    },
    {
      id: "pub-7",
      title: "Machine Learning Approaches for Treatment Response Prediction",
      authors: ["Chen L.", "Dubois S.", "Moreau E."],
      journal: "Science Translational Medicine",
      year: 2022,
      type: "Article",
      abstract:
        "This study develops and validates machine learning models that predict patient response to various treatments based on multi-omics data. Our approach achieves 87% accuracy in predicting treatment outcomes across multiple disease types.",
      keywords: ["Machine Learning", "Precision Medicine", "Treatment Response", "Multi-omics"],
      doi: "10.1126/scitranslmed.2022.404",
      url: "#",
      citations: 45,
      pdf: "#",
    },
    {
      id: "pub-8",
      title: "Sustainable Materials for Next-Generation Photovoltaics",
      authors: ["Chen L.", "Leroy T.", "Dubois S."],
      journal: "Advanced Energy Materials",
      year: 2022,
      type: "Review",
      abstract:
        "This review examines sustainable materials for next-generation photovoltaic technologies, with emphasis on earth-abundant, non-toxic alternatives to conventional solar cell materials. We analyze performance metrics, scalability, and life-cycle assessments.",
      keywords: ["Sustainable Materials", "Photovoltaics", "Green Energy", "Solar Cells"],
      doi: "10.1002/aenm.2022.505",
      url: "#",
      citations: 72,
      pdf: "#",
    },
  ]

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.keywords.join(" ").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || pub.type === selectedType
    const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear

    return matchesSearch && matchesType && matchesYear
  })

  const publicationTypes = Array.from(new Set(publications.map((pub) => pub.type)))
  const publicationYears = Array.from(new Set(publications.map((pub) => pub.year.toString())))

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-electric-50 to-violet-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <BookOpen className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-electric-600 to-violet-600 bg-clip-text text-transparent mb-6 animate-rotate-gradient bg-[length:200%_auto]">
            Nos Publications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les publications scientifiques de notre équipe de recherche dans des revues internationales de
            premier plan.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: FileText, number: "150+", label: "Publications", color: "violet" },
            { icon: Users, number: "25+", label: "Auteurs", color: "electric" },
            { icon: Award, number: "12", label: "Prix", color: "violet" },
            { icon: BookOpen, number: "10k+", label: "Citations", color: "electric" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-100"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher une publication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {publicationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {publicationYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Publications List */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((publication, index) => (
              <motion.div key={publication.id} variants={fadeInUp}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`${
                              publication.type === "Article"
                                ? "bg-violet-600"
                                : publication.type === "Review"
                                  ? "bg-electric-600"
                                  : "bg-green-600"
                            } text-white`}
                          >
                            {publication.type}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-600">
                            {publication.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-gray-800 mb-2 hover:text-violet-600 transition-colors cursor-pointer">
                          {publication.title}
                        </CardTitle>
                        <p className="text-gray-600 mb-2">
                          <strong>Auteurs:</strong> {publication.authors.join(", ")}
                        </p>
                        <p className="text-gray-600 mb-3">
                          <strong>Journal:</strong> {publication.journal}
                        </p>
                        <p className="text-gray-700 leading-relaxed">{publication.abstract}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2 min-w-fit">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-violet-600">{publication.citations}</div>
                          <div className="text-sm text-gray-500">Citations</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {publication.keywords.map((keyword, i) => (
                        <Badge key={i} variant="outline" className="border-violet-200 text-violet-600">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir l'article
                      </Button>
                      <Button
                        variant="outline"
                        className="border-electric-600 text-electric-600 hover:bg-electric-600 hover:text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </Button>
                      <Button variant="ghost" className="text-gray-600 hover:text-violet-600">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        DOI: {publication.doi}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune publication trouvée avec ces critères.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
