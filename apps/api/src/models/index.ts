import { Category } from "./Category.js";
import { Post } from "./Post.js";
import { Product } from "./Product.js";
import { AuditLog } from "./AuditLog.js";
import { RefreshToken } from "./RefreshToken.js";
import { Service } from "./Service.js";
import { PortfolioProject } from "./PortfolioProject.js";
import { PortfolioCategory } from "./PortfolioCategory.js";
import { Brand } from "./Brand.js";
import { Partner } from "./Partner.js";
import { User } from "./User.js";
import { SitePage } from "./SitePage.js";
import { Order } from "./Order.js";
import { OrderItem } from "./OrderItem.js";
import { KeyTechnology } from "./KeyTechnology.js";
import { FeedbackMessage } from "./FeedbackMessage.js";
import { ChatConversation } from "./ChatConversation.js";
import { ChatMessage } from "./ChatMessage.js";
import { ServiceCategory } from "./ServiceCategory.js";
import { ServiceRequest, initServiceRequest } from "./ServiceRequest.js";
import { sequelize } from "../db.js";

export function initModels() {
  // Initialize ServiceRequest model
  initServiceRequest(sequelize);

  // Relations
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
  Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });


  Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
  Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

  PortfolioCategory.hasMany(PortfolioProject, { foreignKey: "portfolioCategoryId", as: "portfolioProjects" });
  PortfolioProject.belongsTo(PortfolioCategory, { foreignKey: "portfolioCategoryId", as: "portfolioCategory" });

  PortfolioCategory.hasMany(PortfolioCategory, { foreignKey: "parentId", as: "children" });
  PortfolioCategory.belongsTo(PortfolioCategory, { foreignKey: "parentId", as: "parent" });

  User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(AuditLog, { foreignKey: "actorUserId", as: "auditLogs" });
  AuditLog.belongsTo(User, { foreignKey: "actorUserId", as: "actor" });

  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  ChatConversation.hasMany(ChatMessage, { foreignKey: "conversationId", as: "messages" });
  ChatMessage.belongsTo(ChatConversation, { foreignKey: "conversationId", as: "conversation" });

  Service.hasMany(Service, { foreignKey: "parentId", as: "children" });
  Service.belongsTo(Service, { foreignKey: "parentId", as: "parent" });

  Service.hasMany(KeyTechnology, { foreignKey: "serviceId", as: "keyTechnologies" });
  KeyTechnology.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

  ServiceCategory.hasMany(Service, { foreignKey: "serviceCategoryId", as: "services" });
  Service.belongsTo(ServiceCategory, { foreignKey: "serviceCategoryId", as: "category" });

  return {
    User,
    Category,
    Brand,
    Product,
    Post,
    RefreshToken,
    AuditLog,
    Service,
    PortfolioCategory,
    PortfolioProject,
    SitePage,
    Order,
    OrderItem,
    Partner,
    FeedbackMessage,
    ChatConversation,
    ChatMessage,
    ServiceRequest,
    KeyTechnology,
    ServiceCategory
  };
}

export {
  User,
  Category,
  Brand,
  Product,
  Post,
  RefreshToken,
  AuditLog,
  Service,
  PortfolioCategory,
  PortfolioProject,
  SitePage,
  Order,
  OrderItem,
  Partner,
  FeedbackMessage,
  ChatConversation,
  ChatMessage,
  ServiceRequest,
  KeyTechnology,
  ServiceCategory
};

