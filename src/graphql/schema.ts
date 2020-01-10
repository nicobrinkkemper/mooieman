import {gql} from 'apollo-server-express';

const schema = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    
    "Get a mooieman"
    mooieman: String

    "Get a fraaievrouw"
    fraaievrouw: String

    "Get the amount of mooiemannen or fraaievrouwen"
    count: String

    "Get all the files of type mooieman or fraaievrouw"
    files: String
    
  }
`;

export default schema;