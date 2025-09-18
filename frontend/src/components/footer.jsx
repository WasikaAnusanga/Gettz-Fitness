import React from "react";

export default function Footer() {
	return (
		<footer className="w-full bg-gray-900 text-white py-6 mt-auto border-t border-gray-800">
			<div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<span className="text-xl font-bold text-red-500">Gettz Fitness</span>
					<span className="text-xs text-gray-400 ml-2">Gym Management System</span>
				</div>
				<div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-400">
					<span>&copy; {new Date().getFullYear()} Gettz Fitness. All rights reserved.</span>
					<span className="hidden md:inline">|</span>
					<a href="/" className="hover:text-red-400 transition">Home</a>
					<a href="/about" className="hover:text-red-400 transition">About</a>
					<a href="/contact" className="hover:text-red-400 transition">Contact</a>
				</div>
			</div>
		</footer>
	);
}
