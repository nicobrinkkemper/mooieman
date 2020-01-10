import { parseLocation, home, user, invoice, notFound, userMatch, invoiceMatch } from './router'
import { format } from 'fp-ts-routing'

import * as assert from 'assert'

//
// parsers
//

assert.strictEqual(parseLocation('/'), home)
assert.strictEqual(parseLocation('/home'), home)
assert.deepEqual(parseLocation('/users/1'), user(1))
assert.deepEqual(parseLocation('/users/1/invoice/2'), invoice(1, 2))
assert.strictEqual(parseLocation('/foo'), notFound)

//
// formatters
//

assert.strictEqual(format(userMatch.formatter, { userId: 1 }), '/users/1')
assert.strictEqual(format(invoiceMatch.formatter, { userId: 1, invoiceId: 2 }), '/users/1/invoice/2')