export type NavItem = {
  label: string
  href: string
}

function normalizePath(path: string) {
  const [cleanPath = '/'] = path.split(/[?#]/)

  if (!cleanPath || cleanPath === '/') {
    return '/'
  }

  return cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath
}

export function isNavItemActive(pathname: string, href: string) {
  if (!href || href === '#') {
    return false
  }

  const currentPath = normalizePath(pathname)
  const itemPath = normalizePath(href)

  if (itemPath === '/') {
    return currentPath === '/'
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}
