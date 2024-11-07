import { Image } from "antd"
import { Building2, Users2, Briefcase } from "lucide-react"
import wk from '../assets/workspace.webp';
import en from '../assets/enterprise.webp';
import home1 from '../assets/home1.jpg';
import home2 from '../assets/home2.jpg';
import { Link } from "react-router-dom";
import { FaUsers, FaHandshake, FaBuilding } from "react-icons/fa";
export default function Component() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-gray-400">About</span> WorkZone
            </h1>
            <p className="text-xl mb-12">Creating a workspace that enhances well-being and work-life harmony</p>

            <div className="grid grid-cols-3 gap-8">
  <div className="flex items-center space-x-4">
    <FaUsers className="text-4xl text-orange-500" />
    <div>
      <p className="text-4xl font-bold">
        1500<span className="text-orange-500">+</span>
      </p>
      <p className="text-gray-600">Members</p>
    </div>
  </div>

  <div className="flex items-center space-x-4">
    <FaHandshake className="text-4xl text-orange-500" />
    <div>
      <p className="text-4xl font-bold">
        50<span className="text-orange-500">+</span>
      </p>
      <p className="text-gray-600">Partners</p>
    </div>
  </div>

  <div className="flex items-center space-x-4">
    <FaBuilding className="text-4xl text-orange-500" />
    <div>
      <p className="text-4xl font-bold">
        600<span className="text-orange-500">+</span>
      </p>
      <p className="text-gray-600">Clients</p>
    </div>
  </div>
</div>
          </div>
        </div>


        <div className="flex flex-col items-start space-y-4">
          <Image
            src={home1}
            alt="Working environment"
            width={700}
            height={350}
            className="rounded-lg object-cover"
          />
        </div>


      </div>

      {/* Mission Section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-12">WorkZone's Mission</h2>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Space</h3>
            <p className="text-gray-600 leading-relaxed">
            Providing an innovative, secure workspace environment that maximizes support for career growth and personal development.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Services</h3>
            <p className="text-gray-600 leading-relaxed">
            Offering diverse, adaptable office solutions tailored to meet the strategic goals of each unique business.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Users2 className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-gray-600 leading-relaxed">
            Building a cohesive member network that fosters collaboration, ignites new ideas, and cultivates talent development.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[400px] w-full">
            <Image
              src={wk}
              alt="Two men working on laptops in a modern office space"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 text-left">WorkZone
              made simple</h2>
            <p className="text-lg text-gray-700 text-left">
              Whatever your budget or need, we make finding the perfect WorkZone easy. From flexible memberships to move-in ready offices, we give you the space and solutions to do your best work.
            </p>
            <Link href="#">
              <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 text-left">Enterprise-grade solutions to power your hybrid strategy</h2>
            <p className="text-lg text-gray-700 text-left">
              Give your real estate portfolio more flexibility while saving on costs by combining our turnkey offices, coworking spaces, and space management technology.
            </p>
            <Link href="#">
              <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
            </Link>
          </div>
          <div className="relative h-[400px] w-full">
            <Image
              src={en}
              alt="Two men working on laptops in a modern office space"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[300px] w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/7LzIRUT4hu0"
              title="YouTube video player"
              frameBorder="15"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 text-left">WorkZone
              made simple</h2>
            <p className="text-lg text-gray-700 text-left">
              Whatever your budget or need, we make finding the perfect WorkZone easy. From flexible memberships to move-in ready offices, we give you the space and solutions to do your best work.
            </p>
            <Link href="#">
              <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
            </Link>
          </div>
        </div>
      </div>


    </div>
  )
}