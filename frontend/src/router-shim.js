'use client';

import { useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';

export const Link = ({ to, href, ...props }) => {
  return <NextLink href={to || href || '#'} {...props} />;
};

export const useNavigate = () => {
  const router = useRouter();
  return useCallback((path, options) => {
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  }, [router]);
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: '',
    state: null,
    key: pathname,
  };
};

export { useSearchParams, useParams };

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  if (replace) {
    router.replace(to);
  } else {
    router.push(to);
  }
  return null;
};
