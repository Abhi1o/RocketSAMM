import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'

const test = getTest()

const companyMenu = [
  {
    label: 'Products',
    items: [
      { label: 'Wallet', href: 'https://wallet.uniswap.org/' },
      { label: 'UniswapX', href: 'https://x.uniswap.org/' },
      { label: 'API', href: 'https://hub.uniswap.org/' },
      { label: 'Unichain', href: 'https://www.unichain.org/' },
    ],
  },
  {
    label: 'Protocol',
    items: [
      { label: 'Governance', href: 'https://uniswap.org/governance' },
      { label: 'Developers', href: 'https://uniswap.org/developers' },
      { label: 'Vote', href: 'https://vote.uniswapfoundation.org' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'Careers', href: 'https://careers.uniswap.org/' },
      { label: 'Blog', href: 'https://blog.uniswap.org/' },
    ],
  },
]

const tabs = [
  {
    label: 'Trade',
    path: '/swap',
    
  },
  
  {
    label: 'Pool',
    path: '/positions',
    dropdown: [
      { label: 'View position', path: '/positions' },
      { label: 'Create position', path: '/positions/create' },
    ],
  },
]
// locator('div').first()
const socialMediaLinks = ['https://github.com/Uniswap', 'https://x.com/Uniswap', 'https://discord.com/invite/uniswap']

test.describe('Navigation', () => {
  test('clicking nav icon redirects to home page', async ({ page }) => {
    await page.goto('/swap')
    await page.getByTestId(TestID.NavUniswapLogo).click()
    await expect(page).toHaveURL(/\/\?intro=true/)
  })

  test.describe('Company menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })
    test('contains appropriate sections and links', async ({ page }) => {
      await page.getByTestId(TestID.NavCompanyMenu).hover()
      await expect(page.getByTestId(TestID.NavCompanyDropdown).first()).toBeVisible()

      for (const section of companyMenu) {
        await expect(
          page.getByTestId(TestID.NavCompanyDropdown).getByTestId(`menu-section-${section.label}`),
        ).toBeVisible()
        for (const item of section.items) {
          await expect(
            page.getByTestId(TestID.NavCompanyDropdown).locator(`a:has-text("${item.label}")`),
          ).toHaveAttribute('href', item.href)
        }
      }
    })

    test('includes social media links', async ({ page }) => {
      await page.getByTestId(TestID.NavCompanyMenu).hover()
      for (const link of socialMediaLinks) {
        await expect(page.getByTestId(TestID.NavCompanyDropdown).locator(`a[href='${link}']`)).toBeVisible()
      }
    })

    
  })

  for (const tab of tabs) {
    test.describe(`${tab.label} tab`, () => {
      test.describe.configure({ retries: 3 }) // these tests are flaky
      test.beforeEach(async ({ page }) => {
        await page.goto('/')
      })
      test(`displays "${tab.label}" tab and navigates`, async ({ page }) => {
        await page.getByTestId(`${tab.label}-tab`).locator('a').click()
        await expect(page).toHaveURL(tab.path)
      })

     
    })
  }

  test('help modal displays appropriate content when clicked', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId(TestID.HelpIcon).click()
    await expect(page.getByTestId(TestID.HelpModal)).toBeVisible()

    await expect(page.getByTestId(TestID.HelpModal).getByText('Get help')).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).getByText('Docs')).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).getByText('Contact us')).toBeVisible()

    await expect(
      page.getByTestId(TestID.HelpModal).locator('a[href="https://support.uniswap.org/hc/en-us"]'),
    ).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).locator('a[href="https://docs.uniswap.org/"]')).toBeVisible()
    await expect(
      page.getByTestId(TestID.HelpModal).locator('a[href="https://support.uniswap.org/hc/en-us/requests/new"]'),
    ).toBeVisible()
  })
})

test.describe('Mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set a mobile viewport
    await page.setViewportSize({ width: 449, height: 900 })
    await page.goto('/')
    await page.waitForTimeout(500)
    await page.getByTestId(TestID.NavCompanyMenu).click()
  })

  for (const tab of tabs) {
    test.describe(`Mobile ${tab.label} tab`, () => {
      test(`displays "${tab.label}" tab and navigates`, async ({ page }) => {
        const drawer = page.getByTestId(TestID.CompanyMenuMobileDrawer)
        await drawer.getByRole('link', { name: tab.label }).click()
        await expect(page).toHaveURL(tab.path)
      })
    })
  }

  test('contains appropriate sections and links', async ({ page }) => {
    const drawer = page.getByTestId(TestID.CompanyMenuMobileDrawer)
    await expect(drawer).toBeVisible()

    for (const section of companyMenu) {
      // Products section is not expandable
      if (section.label !== 'Products') {
        // Expand the section
        await drawer.getByText(section.label).click()
      }
      for (const item of section.items) {
        await expect(drawer.locator(`a:has-text("${item.label}")`)).toHaveAttribute('href', item.href)
      }
    }
  })

  test('includes social media links', async ({ page }) => {
    for (const link of socialMediaLinks) {
      await expect(page.getByTestId(TestID.CompanyMenuMobileDrawer).locator(`a[href='${link}']`)).toBeVisible()
    }
  })

  test('contains Legal & Privacy section with appropriate links', async ({ page }) => {
    const drawer = page.getByTestId(TestID.CompanyMenuMobileDrawer)
    await expect(drawer).toBeVisible()

    await expect(drawer.getByText('Legal & Privacy')).toBeVisible()
    await drawer.getByText('Legal & Privacy').click()

    await expect(drawer.getByText('Your Privacy Choices')).toBeVisible()
    await expect(drawer.getByText('Privacy Policy')).toBeVisible()
    await expect(drawer.getByText('Terms of Service')).toBeVisible()

    await expect(drawer.locator('a[href="https://uniswap.org/terms-of-service"]')).toBeVisible()
  })

  test('help modal displays appropriate content when clicked', async ({ page }) => {
    await page.getByTestId(TestID.CompanyMenuMobileDrawer).getByTestId(TestID.HelpIcon).click()
    await expect(page.getByTestId(TestID.HelpModal)).toBeVisible()

    await expect(page.getByTestId(TestID.HelpModal).getByText('Get help')).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).getByText('Docs')).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).getByText('Contact us')).toBeVisible()

    await expect(
      page.getByTestId(TestID.HelpModal).locator('a[href="https://support.uniswap.org/hc/en-us"]'),
    ).toBeVisible()
    await expect(page.getByTestId(TestID.HelpModal).locator('a[href="https://docs.uniswap.org/"]')).toBeVisible()
    await expect(
      page.getByTestId(TestID.HelpModal).locator('a[href="https://support.uniswap.org/hc/en-us/requests/new"]'),
    ).toBeVisible()
  })
})

test('shows bottom bar on token details page on mobile', async ({ page }) => {
  await page.goto('/explore/tokens/ethereum/NATIVE')
  await page.setViewportSize({ width: 449, height: 900 })
  const bottomBar = page.getByTestId(TestID.TokenDetailsMobileBottomBar)
  await expect(bottomBar).toBeVisible()
  await expect(bottomBar.getByText('Buy')).toBeVisible()
  await expect(bottomBar.getByText('Sell')).toBeVisible()
})
