interface LumaSpinProps {
  size?: number;
  className?: string;
  color?: string;
}

export const LumaSpin = ({ size = 65, className = '', color = '#166534' }: LumaSpinProps) => {
  const scale = size / 65;
  return (
    <div
      className={`relative aspect-square flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center',
      }}
    >
      <span
        className="absolute rounded-[50px] animate-loaderAnim"
        style={{ boxShadow: `inset 0 0 0 3px ${color}` }}
      />
      <span
        className="absolute rounded-[50px] animate-loaderAnim animation-delay"
        style={{ boxShadow: `inset 0 0 0 3px ${color}` }}
      />
      <style>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 35px 35px 0;
          }
          12.5% {
            inset: 0 35px 0 0;
          }
          25% {
            inset: 35px 35px 0 0;
          }
          37.5% {
            inset: 35px 0 0 0;
          }
          50% {
            inset: 35px 0 0 35px;
          }
          62.5% {
            inset: 0 0 0 35px;
          }
          75% {
            inset: 0 0 35px 35px;
          }
          87.5% {
            inset: 0 0 35px 0;
          }
          100% {
            inset: 0 35px 35px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite;
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </div>
  );
};
