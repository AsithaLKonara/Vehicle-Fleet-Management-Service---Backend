import { prisma } from '../lib/prisma';
import { Parser } from 'json2csv';

export const exportVehiclesCsv = async () => {
  const vehicles = await prisma.vehicle.findMany();
  const parser = new Parser();
  return parser.parse(vehicles);
};

export const exportAssignmentsCsv = async () => {
  const assignments = await prisma.assignment.findMany({
    include: {
      vehicle: true,
      driver: true,
      assignedBy: true,
    },
  });

  const flatData = assignments.map(a => ({
    ID: a.id,
    Vehicle: `${a.vehicle.make} ${a.vehicle.model} (${a.vehicle.plateNumber})`,
    Driver: a.driver.name,
    DriverEmail: a.driver.email,
    AssignedBy: a.assignedBy.name,
    AssignedAt: a.assignedAt,
    ReturnedAt: a.returnedAt || 'N/A',
  }));

  const parser = new Parser();
  return parser.parse(flatData);
};

export const exportAuditLogsCsv = async () => {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const flatData = logs.map(l => ({
    ID: l.id,
    Action: l.action,
    Entity: l.entity,
    EntityID: l.entityId,
    User: l.user.name,
    Timestamp: l.createdAt,
    Metadata: JSON.stringify(l.metadata),
  }));

  const parser = new Parser();
  return parser.parse(flatData);
};
