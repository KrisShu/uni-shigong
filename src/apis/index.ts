import commApis from './commApis';
import projectApis from './projectApis';
import mineApis from './mineApis';
import cusProjectApis from './projectApis/cus_index';
import cusMineApis from './mineApis/cus_index';
import cusRequirement from './requirementApis/cus_index';
import taskApis from './taskApis/index';

export default {
    ...commApis,
    ...projectApis,
    ...mineApis,
    ...cusProjectApis,
    ...cusMineApis,
    ...cusRequirement,
    ...taskApis,
};
