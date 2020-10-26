export const Intersect = (list1, list2) =>
    list1.filter(
        (set => a => true === set.has(a._id))(new Set(list2.map(b => b._id)))
    );