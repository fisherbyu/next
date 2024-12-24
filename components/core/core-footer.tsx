import Image from 'next/image';
import GitHubIcon from '@/public/core/github.svg';
import LinkedInIcon from '@/public/core/linkedin.svg';
import AFLogo from '@/public/core/af-logo.svg';
import Link from 'next/link';
import { Divider } from 'thread-ui';

export default function CoreFooter() {
	return (
		<footer className="h-52 w-full">
			<div className="container mx-auto">
				<Divider width="100%" />
				<div className="">
					<p className="mt-4 text-center">
						<Link href="/">
							<Image src={AFLogo} alt="AF" className="mx-auto" />
						</Link>
						<span className="mx-auto mt-1 text-sm text-gray-500">
							<Link href="/login">Created by Andrew Fisher</Link>
						</span>
					</p>
					<div className="flex justify-center my-2 space-x-6">
						<span className="inline-flex justify-center w-full gap-3 m-auto md:justify-start md:w-auto">
							<a href="https://github.com/fisherbyu" className="w-6 h-6 transition fill-black hover:text-blue-500">
								<span className="sr-only">github</span>
								<Image src={GitHubIcon} alt="git-hub logo" />
							</a>
							<a
								href="https://www.linkedin.com/in/fisherandrew777/"
								className="w-6 h-6 transition fill-black hover:text-blue-500"
							>
								<span className="sr-only">Linkedin</span>
								<Image src={LinkedInIcon} alt="LinkedIn Logo" />
							</a>
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
