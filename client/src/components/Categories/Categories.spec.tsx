import { render, screen } from '@testing-library/react'
import React from 'react'

import { MenuContext } from '../../pages/index'
import { Categories } from './Categories'
describe('Categories', () => {
  it('renderes all the categores passed from context', async () => {
    const categories = ['one, two', 'three']
    render(
      <MenuContext.Provider value={{ state: { categories } } as any}>
        <Categories />
      </MenuContext.Provider>
    )

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })
})
