import { getHousehold } from "@/global/actions";
import { MAX_MEMBERS_PER_HOUSEHOLD } from "@/global/limits";
import { auth } from "@/lib/auth";

export async function assertMemberWriteAccess(householdId: string) {
  const session = await auth();
  const user = session?.user;
  const household = await getHousehold(householdId);

  if (user && user.id === household?.ownerId) {
    return;
  }

  throw "NotAllowedToWriteHouseholdExeption";
}

export async function checkIfUserCanCreateNewMember(householdId: string) {
  const household = await getHousehold(householdId);

  if (household?.members == null) return true;

  return household?.members.length < MAX_MEMBERS_PER_HOUSEHOLD;
}
