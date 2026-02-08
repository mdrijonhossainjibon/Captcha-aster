"use client"

import { useState, useEffect } from "react"
import { Download, Settings, Zap, CheckCircle } from "lucide-react"
import { Steps, ConfigProvider, theme } from "antd"

const steps = [
  {
    title: "Install Extension",
    description: "Download our extension with one click for your preferred browser.",
    icon: <Download className="w-5 h-5" />,
  },
  {
    title: "Configure",
    description: "Personalize your settings and choose which captchas to solve.",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: "Auto-Solve",
    description: "AI automatically detects and solves captchas instantly.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Done",
    description: "Browse uninterrupted and save hours of manual work.",
    icon: <CheckCircle className="w-5 h-5" />,
  },
]

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("how-it-works")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7c3aed",
          borderRadius: 12,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden bg-background">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 text-balance px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              User Guide
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Three Steps to <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Freedom</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We've made the setup process incredibly simple. Click through the steps to see how it works!
            </p>
          </div>

          {/* Ant Design Steps - Interactive */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-card/30 backdrop-blur-2xl border border-border/50 p-8 sm:p-16 rounded-[2.5rem] shadow-2xl overflow-hidden relative group mb-12">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <Steps
                direction="horizontal"
                size="small"
                current={currentStep}
                onChange={(c) => setCurrentStep(c)}
                responsive={true}
                items={steps.map((step, idx) => ({
                  title: (
                    <div className={`text-lg font-bold mb-1 transition-colors ${currentStep === idx ? 'text-primary' : 'text-foreground'}`}>
                      {step.title}
                    </div>
                  ),
                  description: (
                    <div className="text-muted-foreground leading-relaxed text-sm max-w-[200px]">
                      {step.description}
                    </div>
                  ),
                  icon: (
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 ${currentStep === idx
                        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-110'
                        : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                      }`}>
                      {step.icon}
                    </div>
                  ),
                }))}
                className="custom-steps cursor-pointer"
              />
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <button className="px-10 py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] group">
                Get Started Now
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
              </button>
              <p className="text-sm text-muted-foreground font-medium">
                {currentStep === 3
                  ? "You're all set! Experience the power of AI."
                  : `Next up: ${steps[(currentStep + 1) % 4].title}`}
              </p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-steps .ant-steps-item-title {
            padding-right: 24px !important;
          }
          .custom-steps .ant-steps-item-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .custom-steps .ant-steps-item-icon {
            margin-bottom: 16px !important;
            margin-inline-start: 0 !important;
            float: none !important;
          }
          .custom-steps .ant-steps-item-content {
            display: block !important;
            min-height: auto !important;
          }
          .custom-steps .ant-steps-item-tail {
            top: 20px !important;
            padding: 0 20px !important;
          }
          .custom-steps .ant-steps-item-tail::after {
            background-color: rgba(124, 58, 237, 0.2) !important;
            height: 2px !important;
          }
          .custom-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
            background-color: #7c3aed !important;
          }
          
          @media (max-width: 768px) {
            .custom-steps .ant-steps-item-container {
              align-items: center;
              text-align: center;
            }
            .custom-steps .ant-steps-item-icon {
              margin-inline-end: 0 !important;
            }
            .custom-steps .ant-steps-item-tail {
              display: none !important;
            }
            .custom-steps .ant-steps-item {
              margin-bottom: 32px;
            }
          }
        `}</style>
      </section>
    </ConfigProvider>
  )
}
