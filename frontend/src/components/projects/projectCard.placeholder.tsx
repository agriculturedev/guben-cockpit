export default function ProjectCardPlaceholder() {
  return (
    <div className="relative h-full w-full flex justify-center items-center rounded-xl overflow-hidden">
      <img className="object-fill w-full" src={"/images/stadt-guben.jpg"} alt={"Stadt Guben"} />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 p-4">
        <p className="text-white text-xl">Stadt Guben</p>
      </div>
    </div>
  )
}
