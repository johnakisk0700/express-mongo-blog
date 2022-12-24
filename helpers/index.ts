import { IPost } from '../models/Post';
import { FilterQuery } from 'mongoose';

const greekMonths = [
    'Ιανουάριος',
    'Φεβρουάριος',
    'Μάρτιος',
    'Απρίλιος',
    'Μάιος',
    'Ιούνιος',
    'Ιούλιος',
    'Αύγουστος',
    'Σεπτέμβριος',
    'Οκτώβριος',
    'Νοέμβριος',
    'Δεκέμβριος',
];

function toMonthName(monthNumber: number, lang: string) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    if (lang === 'en')
        return date.toLocaleString('en-US', {
            month: 'long',
        });
    if (lang === 'el') return greekMonths[monthNumber];
}

function applyPagination(query: FilterQuery<IPost>, { page, perPage }: { page: number; perPage: number }) {
    page--;
    return query.skip(page * perPage).limit(perPage);
}

export { toMonthName, applyPagination };
