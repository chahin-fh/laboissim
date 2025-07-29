"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, History, Lightbulb } from "lucide-react"
import { useContentManager } from "@/lib/content-manager"

export default function AboutPage() {
  const { content } = useContentManager()
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

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

  const teamMembers = [
    {
      id: "prof-martin",
      name: "Prof. Jean Martin",
      role: "Directeur de Recherche",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Le Professeur Jean Martin dirige l'équipe depuis sa création en 2010. Spécialiste en intelligence artificielle éthique, il a publié plus de 100 articles dans des revues internationales et reçu le Prix d'Excellence en Recherche en 2018.",
      expertise: ["Intelligence Artificielle", "Éthique des Technologies", "Apprentissage Automatique"],
      education: "Doctorat en Informatique, École Polytechnique (2005)",
      publications: 120,
      citations: 5600,
      profiles: {
        orcid: "0000-0001-2345-6789",
        linkedin: "jean-martin",
        scholar: "jmartin",
      },
    },
    {
      id: "dr-dubois",
      name: "Dr. Sophie Dubois",
      role: "Chercheuse Principale",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dr. Sophie Dubois est spécialisée en biotechnologie et médecine personnalisée. Ses travaux sur les thérapies géniques ont été publiés dans Nature et Science. Elle a rejoint l'équipe en 2015 après un post-doctorat à Harvard.",
      expertise: ["Biotechnologie", "Médecine Personnalisée", "Thérapie Génique"],
      education: "Doctorat en Biologie Moléculaire, Université de Paris (2012)",
      publications: 85,
      citations: 3200,
      profiles: {
        orcid: "0000-0002-3456-7890",
        linkedin: "sophie-dubois",
        scholar: "sdubois",
      },
    },
    {
      id: "dr-leroy",
      name: "Dr. Thomas Leroy",
      role: "Chercheur Senior",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dr. Thomas Leroy est expert en énergies renouvelables et développement durable. Ses recherches sur les cellules solaires de nouvelle génération ont conduit à plusieurs brevets internationaux et collaborations industrielles.",
      expertise: ["Énergies Renouvelables", "Matériaux Avancés", "Développement Durable"],
      education: "Doctorat en Physique, École Normale Supérieure (2014)",
      publications: 62,
      citations: 2100,
      profiles: {
        orcid: "0000-0003-4567-8901",
        linkedin: "thomas-leroy",
        scholar: "tleroy",
      },
    },
    {
      id: "dr-chen",
      name: "Dr. Li Chen",
      role: "Chercheuse Post-doctorale",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dr. Li Chen est spécialiste en nanotechnologie et matériaux intelligents. Elle a rejoint l'équipe en 2020 après son doctorat au MIT. Ses travaux actuels portent sur les applications médicales des nanomatériaux.",
      expertise: ["Nanotechnologie", "Matériaux Intelligents", "Applications Médicales"],
      education: "Doctorat en Science des Matériaux, MIT (2019)",
      publications: 28,
      citations: 950,
      profiles: {
        orcid: "0000-0004-5678-9012",
        linkedin: "li-chen",
        scholar: "lchen",
      },
    },
    {
      id: "dr-garcia",
      name: "Dr. Carlos Garcia",
      role: "Chercheur Associé",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dr. Carlos Garcia est spécialisé en informatique quantique et cryptographie. Il collabore avec plusieurs universités internationales et a été invité comme conférencier dans plus de 20 pays.",
      expertise: ["Informatique Quantique", "Cryptographie", "Sécurité des Données"],
      education: "Doctorat en Mathématiques Appliquées, Université de Barcelone (2016)",
      publications: 45,
      citations: 1800,
      profiles: {
        orcid: "0000-0005-6789-0123",
        linkedin: "carlos-garcia",
        scholar: "cgarcia",
      },
    },
    {
      id: "dr-moreau",
      name: "Dr. Émilie Moreau",
      role: "Chercheuse Associée",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dr. Émilie Moreau travaille sur l'interface entre neurosciences et intelligence artificielle. Ses recherches visent à développer des modèles computationnels inspirés du cerveau humain pour améliorer les systèmes d'IA.",
      expertise: ["Neurosciences", "Intelligence Artificielle", "Modèles Cognitifs"],
      education: "Doctorat en Neurosciences Computationnelles, Sorbonne Université (2017)",
      publications: 37,
      citations: 1400,
      profiles: {
        orcid: "0000-0006-7890-1234",
        linkedin: "emilie-moreau",
        scholar: "emoreau",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            À Propos de Notre Équipe
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une équipe pluridisciplinaire dédiée à l'innovation et à la découverte scientifique, repoussant les
            frontières de la connaissance depuis plus de 10 ans.
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="history" className="mb-16">
          <TabsList className="grid w-full md:w-fit mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="history" className="text-base flex items-center gap-2">
              <History className="h-4 w-4" /> Histoire
            </TabsTrigger>
            <TabsTrigger value="team" className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Équipe
            </TabsTrigger>
            <TabsTrigger value="expertise" className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Expertise
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{content.about.history.title}</h2>
                <div className="space-y-4 text-gray-600">
                  {content.about.history.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Nos Valeurs</h3>
                  <ul className="space-y-2">
                    {content.about.history.values.map((value, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 bg-purple-600 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong className="text-gray-800">{value.title}</strong> - {value.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Équipe de recherche"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {content.about.history.achievements.founded}
                    </div>
                    <div className="text-gray-700">Fondation de l'équipe</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {content.about.history.achievements.researchers}
                    </div>
                    <div className="text-gray-700">Chercheurs permanents</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {content.about.history.achievements.publications}
                    </div>
                    <div className="text-gray-700">Publications scientifiques</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {content.about.history.achievements.awards}
                    </div>
                    <div className="text-gray-700">Prix d'excellence</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Notre Équipe de Recherche</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Découvrez les chercheurs passionnés qui composent notre équipe pluridisciplinaire
                </p>
              </div>

              {selectedMember ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedMember(null)}
                    className="mb-6 text-purple-600 hover:text-purple-700"
                  >
                    ← Retour à l'équipe
                  </Button>

                  {content.about.team
                    .filter((member) => member.id === selectedMember)
                    .map((member) => (
                      <div key={member.id} className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <div className="sticky top-24">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl mb-6">
                              <Image
                                src="/placeholder.svg?height=300&width=300"
                                alt={member.name}
                                width={300}
                                height={300}
                                className="w-full h-auto object-cover"
                              />
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                              <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                              <p className="text-purple-600 font-medium mb-4">{member.role}</p>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Éducation</p>
                                  <p className="text-gray-700">{member.education}</p>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Publications</p>
                                  <p className="text-gray-700">{member.publications}</p>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Citations</p>
                                  <p className="text-gray-700">{member.citations}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-8">
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle>Biographie</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle>Domaines d'expertise</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {member.expertise.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 text-sm"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {content.about.team.map((member, index) => (
                    <motion.div key={member.id} variants={fadeInUp}>
                      <Card
                        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <div className="relative overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=300&width=300"
                            alt={member.name}
                            width={300}
                            height={300}
                            className="w-full h-64 object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-6 text-white">
                              <h3 className="text-xl font-bold">{member.name}</h3>
                              <p className="text-purple-200">{member.role}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="flex-grow flex flex-col">
                          <div className="mb-4 flex-grow">
                            <p className="text-gray-600 line-clamp-3">{member.bio.substring(0, 120)}...</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {member.expertise.slice(0, 2).map((skill, i) => (
                              <Badge key={i} variant="outline" className="border-purple-600 text-purple-600">
                                {skill}
                              </Badge>
                            ))}
                            {member.expertise.length > 2 && (
                              <Badge variant="outline" className="border-gray-400 text-gray-600">
                                +{member.expertise.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            className="text-purple-600 hover:text-purple-700 p-0 justify-start group"
                          >
                            Voir le profil
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Nos Domaines d'Expertise</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Découvrez les domaines de recherche dans lesquels notre équipe excelle et innove
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {content.about.expertise.map((domain, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=400"
                          alt={domain.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{domain.title}</h3>
                        <p className="text-gray-600 mb-6">{domain.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">Compétences clés :</h4>
                          <div className="flex flex-wrap gap-2">
                            {domain.skills.map((skill, i) => (
                              <Badge
                                key={i}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
