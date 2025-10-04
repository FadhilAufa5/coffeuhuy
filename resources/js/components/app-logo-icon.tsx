export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/logouhuy3.png"   // path logo PNG di folder public
      className={`w-12 h-auto ${props.className ?? ""}`} 
    />
  );
}
