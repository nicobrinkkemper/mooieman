
const resolverFunctions = ({fileService}:any) => ({
    Query: {
        hello: () => 'world',
        mooieman: () => 'mooieman',
        fraaievrouw: () => 'fraaievrouw',
        count: () => 'count',
        files: ()=>fileService.getFiles(),
    }
});

export default resolverFunctions;