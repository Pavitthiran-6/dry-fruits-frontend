import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiPhone, HiMail, HiHeart } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    const socialLinks = [
        { icon: FaFacebook, href: '#', color: 'hover:text-blue-600' },
        { icon: FaTwitter, href: '#', color: 'hover:text-blue-400' },
        { icon: FaInstagram, href: '#', color: 'hover:text-pink-600' },
        { icon: FaYoutube, href: '#', color: 'hover:text-red-600' },
    ];

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Cart', path: '/cart' },
        { name: 'Wishlist', path: '/wishlist' },
    ];

    return (
        <footer className="bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-2xl">🥜</span>
                            </div>
                            <span className="text-3xl font-bold">Nutty Paradise</span>
                        </Link>
                        <p className="text-white/80 mb-6 max-w-md">
                            Bringing you the finest premium dry fruits since 2010.
                            Sourced from the best farms, served with joy. Experience the difference of
                            quality and freshness.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-colors ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-white/80 hover:text-white transition-colors hover:underline"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-2 text-white/80">
                                <HiLocationMarker className="w-5 h-5" />
                                <span>123 Dry Fruits Lane, Mumbai, India</span>
                            </li>
                            <li className="flex items-center space-x-2 text-white/80">
                                <HiPhone className="w-5 h-5" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-2 text-white/80">
                                <HiMail className="w-5 h-5" />
                                <span>hello@nuttyparadise.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-8 text-center">
                    <p className="text-white/60 flex items-center justify-center space-x-1">
                        <span>Made with</span>
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <HiHeart className="w-5 h-5 text-pink-300" />
                        </motion.span>
                        <span>by Nutty Paradise © 2024</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
