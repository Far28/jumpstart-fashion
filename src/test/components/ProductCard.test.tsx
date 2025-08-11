import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { ProductCard } from '@/components/ProductCard'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image_url: 'https://example.com/image.jpg',
  category: 'women',
  description: 'Test description',
  rating: 4.5,
  review_count: 10,
  is_sale: false,
  sale_price: null,
  brand: 'Test Brand',
  sizes: ['S', 'M', 'L'],
  colors: ['Black', 'White'],
  stock_quantity: 5,
  subcategory: 'tops',
  tags: ['casual'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <CartProvider>
      {children}
    </CartProvider>
  </BrowserRouter>
)

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
  })

  it('shows sale price when product is on sale', () => {
    const saleProduct = { ...mockProduct, is_sale: true, sale_price: 79.99 }
    render(
      <TestWrapper>
        <ProductCard product={saleProduct} />
      </TestWrapper>
    )
    
    expect(screen.getByText('$79.99')).toBeInTheDocument()
  })

  it('displays rating information', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )
    
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(10 reviews)')).toBeInTheDocument()
  })
})
