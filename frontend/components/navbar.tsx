"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Users, FolderOpen, BookOpen, Calendar, Mail, LogIn, User, Settings } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import { useContentManager } from "@/lib/content-manager"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { content } = useContentManager()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: Users },
    { href: "/projects", label: "Projets", icon: FolderOpen },
    { href: "/publications", label: "Publications", icon: BookOpen },
    { href: "/events", label: "Événements", icon: Calendar },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-indigo-100" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg icon-enhanced"
              whileHover={{
                boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
            >
              <span className="text-white font-bold text-lg">R</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gradient heading-modern">{content.logo.text}</span>
              <span className="text-xs text-slate-500 -mt-1">{content.logo.subtitle}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-all duration-200 group relative ${
                    isActive ? "text-indigo-600 font-medium" : ""
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 group-hover:scale-110 transition-transform icon-enhanced ${
                      isActive ? "text-indigo-600" : ""
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 gradient-primary rounded-full"
                      layoutId="navbar-indicator"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <User className="h-4 w-4 mr-2 icon-enhanced" />
                    Dashboard
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      <Settings className="h-4 w-4 mr-2 icon-enhanced" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <LogIn className="h-4 w-4 mr-2 icon-enhanced" />
                    Connexion
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-indigo-50" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="h-6 w-6 text-indigo-600 icon-enhanced" />
            ) : (
              <Menu className="h-6 w-6 text-indigo-600 icon-enhanced" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-indigo-100 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 text-slate-600 hover:text-indigo-600 transition-colors py-2 px-3 rounded-lg hover:bg-indigo-50 ${
                        isActive ? "text-indigo-600 font-medium bg-indigo-50" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className={`h-5 w-5 icon-enhanced ${isActive ? "text-indigo-600" : ""}`} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
                <div className="border-t border-slate-200 pt-4">
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-indigo-600 hover:bg-indigo-50">
                          <User className="h-4 w-4 mr-2 icon-enhanced" />
                          Dashboard
                        </Button>
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <Button variant="ghost" className="w-full justify-start text-amber-600 hover:bg-amber-50">
                            <Settings className="h-4 w-4 mr-2 icon-enhanced" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start text-indigo-600 hover:bg-indigo-50">
                          <LogIn className="h-4 w-4 mr-2 icon-enhanced" />
                          Connexion
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
