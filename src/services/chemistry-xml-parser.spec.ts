import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChemistryDataService } from './chemistry-data.service'
import { ChemistryDataParser } from './chemistry-xml-parser.service'
import example from "./example-xml.test"

describe('chemistry xml parser service', () => {
    beforeEach(() => {
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should parse example data', async ()=>{
        var response= ChemistryDataParser.parseString(example);
        console.log(response.value())
    })
})