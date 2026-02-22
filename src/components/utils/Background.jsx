"use client"

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Main gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50   " />
//   "
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"
                style={{ animation: "float 6s ease-in-out infinite, pulse 4s ease-in-out infinite" }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
                style={{ animation: "float 8s ease-in-out infinite reverse, pulse 4s ease-in-out infinite 1s" }}
            />
            <div
                className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl"
                style={{ animation: "float 7s ease-in-out infinite, pulse 4s ease-in-out infinite 0.5s" }}
            />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div
                className="absolute top-20 left-20 w-4 h-4 bg-blue-400/60 rounded-full"
                style={{ animation: "bounce 2s infinite, float 5s ease-in-out infinite" }}
            />
            <div
                className="absolute top-40 right-32 w-3 h-3 bg-purple-400/60 rounded-full"
                style={{ animation: "bounce 2.5s infinite 0.7s, float 6s ease-in-out infinite reverse" }}
            />
            <div
                className="absolute bottom-32 left-1/3 w-3.5 h-3.5 bg-cyan-400/60 rounded-full"
                style={{ animation: "bounce 2.2s infinite 1s, float 5.5s ease-in-out infinite" }}
            />
            <div
                className="absolute bottom-20 right-20 w-4 h-4 bg-pink-400/60 rounded-full"
                style={{ animation: "bounce 2.8s infinite 0.5s, float 7s ease-in-out infinite reverse" }}
            />

            <div
                className="absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-400/50 rounded-full"
                style={{ animation: "bounce 3s infinite 1.5s, float 4s ease-in-out infinite" }}
            />
            <div
                className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-green-400/50 rounded-full"
                style={{ animation: "bounce 2.3s infinite 0.8s, float 6.5s ease-in-out infinite reverse" }}
            />

            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22noiseFilter%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
      `}</style>
        </div>
    )
}
