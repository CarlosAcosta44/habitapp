'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

interface ParticlesProps {
  className?: string
  particleCount?: number
  particleColor?: string
  lineColor?: string
  particleSize?: number
  interactionRadius?: number
}

export function Particles({
  className = '',
  particleCount = 80,
  particleColor = 'rgba(99, 102, 241, 0.8)', // indigo-500
  lineColor = 'rgba(139, 92, 246, 0.2)', // violet-500
  particleSize = 2,
  interactionRadius = 150,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resize = () => {
      // Usar parentElement para ajustar al contenedor de forma responsive
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
        initParticles()
      }
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * particleSize + 1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const { x: mouseX, y: mouseY, active } = mouseRef.current

      // Actualizar posiciones y dibujar
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        
        // Movimiento base
        p.x += p.vx
        p.y += p.vy

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Interacción con ratón (repulsión magnética ligera)
        if (active) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius
            p.x -= (dx / distance) * force * 2
            p.y -= (dy / distance) * force * 2
          }
        }

        // Dibujar partícula
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Dibujar conexiones
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            const opacity = 1 - distance / 100
            // Aplicar opacidad al color de línea
            const colorMatch = lineColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
            if (colorMatch) {
               ctx.strokeStyle = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, ${opacity * 0.5})`
            } else {
               ctx.strokeStyle = lineColor
            }
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Handlers para el mouse interactivo
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    
    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMounted, particleCount, particleColor, lineColor, particleSize, interactionRadius])

  if (!isMounted) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </motion.div>
  )
}
