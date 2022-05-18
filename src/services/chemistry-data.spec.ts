import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch from "node-fetch";
import { ChemistryDataService } from './chemistry-data.service';

describe('chemistry data service', () => {
    beforeEach(() => {
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should fetch data', () => {
        const fetchMock= vi.fn().mockImplementation(fetch);

        const result = ChemistryDataService.fetchChemTemplate(fetchMock, "Unstable Mutagen");
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })
})